# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Receipt retries preserve transcript boundaries, successor ownership and media identity."""



from pathlib import Path



from types import SimpleNamespace



import pytest



from gateway.session_authority import LiveSession



from gateway.session_contract import SessionActor, SessionRef, Submission



from gateway.session_results import admission_result, finish_result



from kestrel_state_runtime import (RuntimeStoreError, admit_session_input, begin_runtime_epoch,
    claim_session_input, get_session_admission, recover_session_inputs)



def test_results_retain_only_turn_output_and_retirement_keeps_accounting(owner):
    owner.db.create_session('s', source='api_server')
    messages = []
    admissions = []
    for index in range(3):
        admit_session_input(owner.db, epoch=owner.epoch, principal_id='api', session_id='s',
                            request_id=str(index), payload={'text': str(index)})
        row = claim_session_input(owner.db, epoch=owner.epoch, session_id='s')
        messages += [{'role': 'user', 'content': 'history-sentinel'},
                     {'role': 'assistant', 'content': f'answer-{index}'}]
        finish_result(owner.db, epoch=owner.epoch, row=row, response=f'answer-{index}', outcome='completed',
            result={'result': {'messages': list(messages), 'final_response': f'answer-{index}', 'completed': True},
                    'usage': {'input_tokens': 11, 'cost': .5}})
        saved = admission_result(owner.db, row['admission_id'])
        assert saved['result']['messages'] == [messages[-1]]
        admissions.append(row['admission_id'])
    owner.db.delete_session('s')
    for aid in admissions:
        saved = admission_result(owner.db, aid)
        assert saved['result']['messages'] == []
        assert saved['usage'] == {'input_tokens': 11, 'cost': .5}
        assert saved['result']['completed'] is True
